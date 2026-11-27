<?php

declare(strict_types=1);

namespace App\Api\Connections;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Connections\Values\CommandFingerprint;
use App\Contracts\Domains\ApiPayload;
use App\Exceptions\VerbNotServed;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * A connected machine's journal verb, run on the server for the caller's own binding: the arguments as typed after
 * journal and what was piped into it. The request key runs it once; asked again it answers the recorded frames.
 *
 * @implements ApiPayload<ProjectCommandFrames>
 */
#[Endpoint(
    'api/project-commands',
    'POST',
    ProjectCommandFrames::class,
    ApiEffect::KeyedWrite,
    ReceiptOwner::Operation,
    refusals: [VerbNotServed::class],
)]
final class RunProjectCommandPayload extends Data implements ApiPayload
{
    /**
     * @param  list<string>  $argv
     */
    public function __construct(
        #[Ulid, MapName('binding')]
        public readonly string $bindingId,
        #[Min(2), Max(200)]
        public readonly array $argv,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public readonly CallKey $requestKey,
        // What was piped into the verb: an empty pipe arrives as an empty string or none, which Laravel's rules
        // cannot tell apart, so pipedInput answers both as nothing piped.
        #[Max(1_048_576)]
        public readonly string|null $stdin = null,
    ) {}

    /**
     * What was piped into the verb; a terminal pipes nothing.
     */
    public function pipedInput(): string
    {
        return (string) $this->stdin;
    }

    /**
     * The digest that binds this request id to this operation, asked by this agent.
     */
    public function fingerprintFor(string $agentId): string
    {
        return CommandFingerprint::of($this->argv, $this->pipedInput(), $this->bindingId, $agentId);
    }

    /**
     * The journal verb the arguments name, as the artisan command it is: task show for journal task show 3.
     */
    public function verbName(): string
    {
        return "{$this->argv[0]}:{$this->argv[1]}";
    }
}
