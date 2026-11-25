<?php

declare(strict_types=1);

namespace Domain\Helpers\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use Domain\Helpers\Data\HelperNoticeListData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists the newest notices the caller was left about its helpers' jobs.
 *
 * @implements ApiPayload<HelperNoticeListData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/notices', 'POST', HelperNoticeListData::class, ApiEffect::Read)]
final class ListHelperNoticesPayload extends Data implements ApiPayload {}
