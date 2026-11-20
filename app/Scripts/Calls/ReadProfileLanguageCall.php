<?php

declare(strict_types=1);

namespace App\Scripts\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Scripts\Data\ProfileLanguageData;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<ProfileLanguageData>
 */
#[Endpoint('profiles/language', 'POST', ProfileLanguageData::class, CallEffect::Read)]
final class ReadProfileLanguageCall extends Data implements JournalCall {}
