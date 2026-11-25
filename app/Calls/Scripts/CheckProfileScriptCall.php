<?php

declare(strict_types=1);

namespace App\Calls\Scripts;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\Profiles\ProfileDraftData;
use App\Enums\Processes\CallEffect;
use App\Values\ScriptSource;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<ProfileDraftData>
 */
#[Endpoint('profiles/draft/check', 'POST', ProfileDraftData::class, CallEffect::Read)]
final class CheckProfileScriptCall extends Data implements JournalCall
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
