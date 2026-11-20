<?php

declare(strict_types=1);

namespace Domain\Helpers\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Domain\Helpers\Http\Data\HelperNoticeListData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Lists the newest notices the caller was left about its helpers' jobs.
 *
 * @implements JournalCall<HelperNoticeListData>
 */
#[MapName(SnakeCaseMapper::class)]
#[Endpoint('helpers/notices', 'POST', HelperNoticeListData::class, CallEffect::Read)]
final class ListHelperNoticesCall extends Data implements JournalCall {}
