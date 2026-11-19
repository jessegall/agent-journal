<?php

declare(strict_types=1);

namespace Domain\Documents\Contracts;

use App\Actors\Support\ActorIdentity;
use Domain\Documents\Support\RequestEditor;
use Illuminate\Container\Attributes\Bind;

/**
 * Who edits documents in this request.
 */
#[Bind(RequestEditor::class)]
interface EditorContext
{
    public function editor(): ActorIdentity;
}
