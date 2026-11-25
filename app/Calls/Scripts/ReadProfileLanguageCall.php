<?php

declare(strict_types=1);

namespace App\Calls\Scripts;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\Profiles\ProfileLanguageData;
use App\Enums\Processes\CallEffect;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<ProfileLanguageData>
 */
#[Endpoint('profiles/language', 'POST', ProfileLanguageData::class, CallEffect::Read)]
final class ReadProfileLanguageCall extends Data implements JournalCall {}
