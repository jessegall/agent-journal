<?php

declare(strict_types=1);

namespace App\Calls\Scripts;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\JournalCall;
use App\Data\Profiles\ProfileDraftData;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
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
        #[Max(ScriptSource::BYTE_LIMIT)]
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
