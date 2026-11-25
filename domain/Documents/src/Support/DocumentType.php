<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use Domain\Documents\Models\Document;

/**
 * The name links, shares and docks give a document, for code that names documents without reading the model.
 */
final class DocumentType
{
    /**
     * The document's link type, its alias in the morph map.
     */
    public static function linkType(): string
    {
        return Document::linkType();
    }
}
