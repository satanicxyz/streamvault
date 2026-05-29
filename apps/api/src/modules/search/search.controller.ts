import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search content' })
  async search(
    @Query('q') query: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.search(query, page, limit);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  async suggestions(@Query('q') query: string) {
    return this.searchService.getSuggestions(query);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending searches' })
  async trending() {
    return this.searchService.getTrendingSearches();
  }
}
