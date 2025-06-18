-- CreateTable
CREATE TABLE "Sound" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_played" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistSound" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "soundId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "is_played" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistSound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoundSchedule" (
    "id" TEXT NOT NULL,
    "soundId" TEXT NOT NULL,
    "days" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "minute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoundSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSound_playlistId_order_key" ON "PlaylistSound"("playlistId", "order");

-- AddForeignKey
ALTER TABLE "PlaylistSound" ADD CONSTRAINT "PlaylistSound_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSound" ADD CONSTRAINT "PlaylistSound_soundId_fkey" FOREIGN KEY ("soundId") REFERENCES "Sound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoundSchedule" ADD CONSTRAINT "SoundSchedule_soundId_fkey" FOREIGN KEY ("soundId") REFERENCES "Sound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
