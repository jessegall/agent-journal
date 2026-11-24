<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Models\Profiles\ProfileRun;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A profile run as its actor and the editors read it: the profile revision it runs, where it stands, the line it
 * waits on, what it told the actor and the steps it recorded. Reading it changes nothing.
 */
#[TypeScript]
final class ProfileRunData extends Data
{
    /**
     * @param  list<ProfileStepData>  $steps
     */
    public function __construct(
        public readonly string $id,
        public readonly string $profile,
        public readonly int $revision,
        public readonly string $state,
        public readonly int $line,
        public readonly string|null $message,
        #[DataCollectionOf(ProfileStepData::class)]
        public readonly array $steps,
    ) {}

    public static function fromRun(ProfileRun $run): self
    {
        return new self(
            $run->id,
            $run->profile_key,
            $run->profile_revision,
            $run->state->value,
            $run->cursor,
            $run->message,
            array_values($run->results->map(ProfileStepData::fromResult(...))->all()),
        );
    }
}
