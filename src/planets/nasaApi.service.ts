// nasa-api.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RedisCacheService } from 'src/utils/redis-cache.service';

@Injectable()
export class NasaApiService {
  private readonly apiUrl = process.env.NASA_API;
  private readonly cacheKey = 'suitablePlanets';

  constructor(private readonly cacheService: RedisCacheService) {}

  async getSuitablePlanets(): Promise<any[]> {
    // Verificar se os dados estão em cache
    const cachedData = await this.cacheService.get(this.cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Fazer a chamada à API
    const response = await axios.get(this.apiUrl);
    const data = response.data;

    // Armazenar os dados em cache
    await this.cacheService.set(this.cacheKey, data, 60 * 60 * 12); // Definir tempo de expiração em segundos (por exemplo, 60 segundos)

    return data;
  }
}
