<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use Domain\Documents\Data\DraftState;
use Domain\Documents\Data\DraftView;
use Domain\Documents\Exceptions\DraftMissing;

/**
 * Reads the draft the editor of this request holds; it never stands in for a document's published text.
 */
interface DraftResolver
{
    /**
     * @throws DraftMissing
     */
    public function current(int $documentNumber): DraftView;

    /**
     * The editor's own draft of the document, or who else holds one, or neither.
     */
    public function stateOf(int $documentNumber): DraftState;
}
