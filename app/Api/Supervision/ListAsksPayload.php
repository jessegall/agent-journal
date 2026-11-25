<?php

declare(strict_types=1);

namespace App\Api\Supervision;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Data\Asks\AskInbox;
use App\Enums\Processes\ApiEffect;
use App\Values\AskReference;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * @implements ApiPayload<AskInbox>
 */
#[Endpoint('asks/list', 'POST', AskInbox::class, ApiEffect::Read)]
final class ListAsksPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public readonly string|null $before = null,
    ) {}

    public function cursor(): AskReference|null
    {
        if ($this->before === null) {
            return null;
        }

        return new AskReference(strtolower($this->before));
    }
}
