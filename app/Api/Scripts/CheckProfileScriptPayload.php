<?php

declare(strict_types=1);

namespace App\Api\Scripts;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Profiles\Data\ProfileDraftData;
use App\Values\ScriptSource;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * @implements ApiPayload<ProfileDraftData>
 */
#[Endpoint('profiles/draft/check', 'POST', ProfileDraftData::class, ApiEffect::Read)]
final class CheckProfileScriptPayload extends Data implements ApiPayload
{
    /**
     * @param  array<string, mixed>  $commands
     */
    public function __construct(
        #[Max(64)]
        public readonly string $profile,
        #[Max(ScriptSource::BYTE_LIMIT)]
        public readonly string $source,
        public readonly array $commands = [],
    ) {}

    public function scriptSource(): ScriptSource
    {
        return ScriptSource::fromDefinitions($this->source, $this->commands);
    }
}
