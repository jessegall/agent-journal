<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The newest notices a parent was left about its helpers' jobs.
 */
#[MapName(SnakeCaseMapper::class)]
final class HelperNoticeListData extends Data
{
    /**
     * @param  list<HelperNoticeData>  $notices
     */
    public function __construct(
        #[DataCollectionOf(HelperNoticeData::class)]
        public array $notices,
    ) {}
}
