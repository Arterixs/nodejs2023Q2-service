import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Album } from '../entity/album';

export class UpdateAlbumDto {
  @ApiProperty({ example: 'Scooby Doo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2028 })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    nullable: true,
  })
  @ValidateIf((album: Album) => album.artistId !== null)
  @IsUUID(4)
  @IsNotEmpty()
  artistId: string | null;
}
