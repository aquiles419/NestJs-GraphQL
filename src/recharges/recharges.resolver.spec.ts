import { Test, TestingModule } from '@nestjs/testing';
import { RechargesResolver } from './recharges.resolver';
import { RechargesService } from './recharges.service';

describe('RechargesResolver', () => {
  let resolver: RechargesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RechargesResolver, RechargesService],
    }).compile();

    resolver = module.get<RechargesResolver>(RechargesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
