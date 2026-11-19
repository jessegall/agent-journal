<?php

declare(strict_types=1);

namespace App\Comments\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Casts\CallKeyCast;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use App\AgentRequests\Support\CallKey;
use App\AgentRequests\Transformers\CallKeyTransformer;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

/**
 * Comments on a record, on the whole of it or on one place; the submission key keeps a retried comment one comment.
 *
 * @implements JournalCall<CommentPosted>
 */
#[Endpoint('comments/post', 'POST', CommentPosted::class, CallEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class PostCommentCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(64)]
        public string $target,
        public string $body,
        #[MapName('submission_key'), Uuid]
        public string $submissionKey,
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        #[LiteralTypeScriptType('string')]
        public CallKey $requestKey,
        public CommentPlace|null $place = null,
    ) {}
}
