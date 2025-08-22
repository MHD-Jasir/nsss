import React, { useMemo } from 'react';
import { Plus, Trash2, Star, StarOff } from 'lucide-react';
import { StoryBatch } from '../types';

interface StoriesPageProps {
  batches: StoryBatch[];
  currentBatchId: string;
  setCurrentBatchId: (id: string) => void;
  canManage: boolean;
  isOfficer: boolean;
  onCreateBatch: (name: string) => void;
  onCreateAlbum: (batchId: string, name: string) => void;
  onAddMedia: (batchId: string, albumId: string, files: File[]) => void;
  onDeleteMedia: (batchId: string, albumId: string, mediaId: string) => void;
  onToggleFeatured: (batchId: string, mediaId: string) => void;
  onMergeCurrentAlbumToSingle: (batchId: string) => void;
}

const AutoScroller: React.FC<{ direction: 'left' | 'right'; items: { id: string; url: string }[] }>
  = ({ direction, items }) => {
  return (
    <div className="overflow-hidden w-full">
      <div className="flex space-x-4 animate-[scroll_30s_linear_infinite]" style={{ animationDirection: direction === 'left' ? 'normal' : 'reverse' }}>
        {[...items, ...items].map((it, idx) => (
          <img key={it.id + '-' + idx} src={it.url} alt="featured" className="w-40 h-28 object-cover rounded-lg border" />
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export const StoriesPage: React.FC<StoriesPageProps> = ({
  batches,
  currentBatchId,
  setCurrentBatchId,
  canManage,
  isOfficer,
  onCreateBatch,
  onCreateAlbum,
  onAddMedia,
  onDeleteMedia,
  onToggleFeatured,
  onMergeCurrentAlbumToSingle,
}) => {
  const currentBatch = useMemo(() => batches.find(b => b.id === currentBatchId) || batches[0], [batches, currentBatchId]);

  const featuredItems = useMemo(() => {
    const all = currentBatch?.albums.flatMap(a => a.media) || [];
    return (currentBatch?.featuredMediaIds || [])
      .map(id => all.find(m => m.id === id))
      .filter(Boolean)
      .filter(m => m!.type === 'image')
      .map(m => ({ id: m!.id, url: m!.url })) as { id: string; url: string }[];
  }, [currentBatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stories</h1>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentBatch?.id}
              onChange={(e) => setCurrentBatchId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {isOfficer && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                onClick={() => {
                  const name = prompt('Enter new batch name');
                  if (name) onCreateBatch(name);
                }}
              >
                Create Batch
              </button>
            )}
          </div>
        </div>

        {featuredItems.length > 0 && (
          <div className="space-y-4 mb-8">
            <AutoScroller direction="left" items={featuredItems.slice(0,5)} />
            <AutoScroller direction="right" items={featuredItems.slice(5,10)} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{currentBatch?.name}</h2>
            {canManage && (
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2"
                onClick={() => {
                  const name = prompt('Enter new album name');
                  if (name && currentBatch) onCreateAlbum(currentBatch.id, name);
                }}
              >
                <Plus size={18} /> New Album
              </button>
            )}
          </div>

          {currentBatch?.albums.length === 0 ? (
            <div className="text-gray-500">No albums yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBatch.albums.map(album => (
                <div key={album.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{album.name}</h3>
                    {canManage && (
                      <label className="cursor-pointer text-sm text-blue-700">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length && currentBatch) onAddMedia(currentBatch.id, album.id, files);
                            e.currentTarget.value = '';
                          }}
                        />
                        Add Media
                      </label>
                    )}
                  </div>

                  {album.media.length === 0 ? (
                    <div className="text-gray-500 text-sm">No media yet.</div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      {album.media.slice(0,5).map(item => (
                        <div key={item.id} className="relative group">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.title || ''} className="w-full h-24 object-cover rounded" />
                          ) : (
                            <video src={item.url} className="w-full h-24 object-cover rounded" />
                          )}
                          {canManage && (
                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                              <button
                                className="bg-white text-yellow-600 px-2 py-1 rounded shadow"
                                title="Toggle featured"
                                onClick={() => onToggleFeatured(currentBatch!.id, item.id)}
                              >
                                {currentBatch!.featuredMediaIds.includes(item.id) ? <Star size={16} /> : <StarOff size={16} />}
                              </button>
                              <button
                                className="bg-white text-red-600 px-2 py-1 rounded shadow"
                                title="Delete"
                                onClick={() => onDeleteMedia(currentBatch!.id, album.id, item.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default StoriesPage;


