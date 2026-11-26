<?php

declare(strict_types=1);

namespace Domain\Comments\Api;

use App\Attributes\Api\Endpoint;
use App\Casts\CallKeyCast;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\ReceiptOwner;
use App\Support\CallKey;
use App\Support\Transformers\CallKeyTransformer;
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
 * @implements ApiPayload<CommentPosted>
 */
#[Endpoint('comments/post', 'POST', CommentPosted::class, ApiEffect::KeyedWrite, ReceiptOwner::CommandBus)]
final class PostCommentPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(64)]
        public string $target,
        public string $body,
        #[MapName('submission_key'), Uuid]
        public string $submissionKey,
        #[LiteralTypeScriptType('string')]
        #[MapName('request_key'), WithCast(CallKeyCast::class), WithTransformer(CallKeyTransformer::class)]
        public CallKey $requestKey,
        public CommentPlace|null $place = null,
    ) {}
}
