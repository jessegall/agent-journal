<?php

declare(strict_types=1);

namespace App\Scripts\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ScriptSource;
use App\Scripts\Data\ProfileDraftData;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<ProfileDraftData>
 */
#[Endpoint('profiles/draft/save', 'POST', ProfileDraftData::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class SaveProfileDraftCall extends Data implements JournalCall
{
    /**
     * @param  array<string, mixed>  $commands
     */
    public function __construct(
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        #[Max(64)]
        public readonly string $profile,
        public readonly int $expectedRevision,
        #[Max(ScriptSource::MAX_BYTES)]
        public readonly string $source,
        public readonly array $commands = [],
    ) {}

    public function profileKey(): ProfileKey
    {
        return ProfileKey::from($this->profile);
    }

    public function scriptSource(): ScriptSource
    {
        return ScriptSource::fromDefinitions($this->source, $this->commands);
    }
}
