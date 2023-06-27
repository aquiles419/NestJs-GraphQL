import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NasaApiService {
  private readonly apiUrl =
    'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps+where+pl_bmassj+>+10&format=json';

  async getSuitablePlanets(): Promise<any[]> {
    const response = await axios.get(this.apiUrl);
    return response.data;
  }
}
