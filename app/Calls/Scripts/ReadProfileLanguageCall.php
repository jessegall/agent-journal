<?php

declare(strict_types=1);

namespace App\Calls\Scripts;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Data\ProfileLanguageData;
use App\Enums\CallEffect;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<ProfileLanguageData>
 */
#[Endpoint('profiles/language', 'POST', ProfileLanguageData::class, CallEffect::Read)]
final class ReadProfileLanguageCall extends Data implements JournalCall {}
