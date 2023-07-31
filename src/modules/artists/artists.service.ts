import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArtistsDBService } from 'src/modules/artists/db/artists-db.service';
import { v4 as uuidv4 } from 'uuid';
import { AlbumsDBService } from 'src/modules/albums/db/albums-db.service';
import { TracksDBService } from 'src/modules/tracks/db/tracks-db.service';
import { FavoritesDBService } from 'src/modules/favorites/db/favorites-db.service';
import { ARTIST_NOT_FOUND } from 'src/constants/const';
import { Artist } from './entity/artist';
import { CreateArtistDto } from './dto/create-artist';
import { UpdateArtistDto } from './dto/update-artist';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly dataBase: ArtistsDBService,
    private readonly dataBaseAlbum: AlbumsDBService,
    private readonly dataBaseTrack: TracksDBService,
    private readonly dataBaseFavs: FavoritesDBService,
  ) {}

  getArtists(): Artist[] {
    return this.dataBase.getAll();
  }

  getArtistBuId(id: string) {
    this.checkArtist(id);
    return this.takeArtist(id);
  }

  setArtist(album: CreateArtistDto) {
    const fullAlbum = this.createFullArtist(album);
    this.addAlbumInDB(fullAlbum);
    return this.takeArtist(fullAlbum.id);
  }

  checkArtist(id: string) {
    const isArtist = this.dataBase.checkArtist(id);
    if (!isArtist) {
      throw new HttpException(ARTIST_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  takeArtist(id: string) {
    return this.dataBase.getById(id);
  }

  addAlbumInDB(album: Artist) {
    this.dataBase.create(album);
  }

  createFullArtist(album: CreateArtistDto) {
    return { ...album, id: uuidv4() };
  }

  updateArtist(nextAlbum: UpdateArtistDto, prevAlbum: Artist) {
    return { ...prevAlbum, ...nextAlbum };
  }

  changeArtist(nextAlbum: UpdateArtistDto, id: string) {
    this.checkArtist(id);
    const prevAlbum = this.takeArtist(id);
    const updateAlbum = this.updateArtist(nextAlbum, prevAlbum);
    this.addAlbumInDB(updateAlbum);
    return this.takeArtist(id);
  }

  deleteArtist(id: string) {
    this.dataBase.delete(id);
  }

  removeArtist(id: string) {
    this.checkArtist(id);
    this.deleteArtist(id);
    this.deleteArtistByIdAlbumDB(id);
    this.deleteArtistByIdTrackDB(id);
    this.deleteArtistByIdFavsDB(id);
  }

  deleteArtistByIdAlbumDB(id: string) {
    this.dataBaseAlbum.deleteArtistById(id);
  }

  deleteArtistByIdTrackDB(id: string) {
    this.dataBaseTrack.deleteArtistById(id);
  }

  deleteArtistByIdFavsDB(id: string) {
    this.dataBaseFavs.deleteArtist(id);
  }
}
