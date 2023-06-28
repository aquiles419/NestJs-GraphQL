import { Test, TestingModule } from '@nestjs/testing';
import { StationsResolver } from './stations.resolver';
import { StationsService } from './stations.service';

describe('StationsResolver', () => {
  let resolver: StationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StationsResolver, StationsService],
    }).compile();

    resolver = module.get<StationsResolver>(StationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
