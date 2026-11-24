<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Who a reader may ask for feedback on a document, and where the ask is sent.
 */
#[TypeScript]
final class DocumentFeedbackPartData extends Data
{
    /**
     * @param  list<DocumentRecipientData>  $recipients
     */
    public function __construct(
        #[DataCollectionOf(DocumentRecipientData::class)]
        public readonly array $recipients,
        public readonly string $address,
    ) {}
}
