<?php

declare(strict_types=1);

namespace App\Api\Scripts;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Profiles\Data\ProfileLanguageData;
use Spatie\LaravelData\Data;

/**
 * @implements ApiPayload<ProfileLanguageData>
 */
#[Endpoint('profiles/language', 'POST', ProfileLanguageData::class, ApiEffect::Read)]
final class ReadProfileLanguagePayload extends Data implements ApiPayload {}
