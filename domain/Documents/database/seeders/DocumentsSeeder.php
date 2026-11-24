<?php

declare(strict_types=1);

namespace Domain\Documents\Database\Seeders;

use App\Contracts\Actors\Actor;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Illuminate\Database\Seeder;

/**
 * A local document by the owner, so the running app shows a document row and its reader. A journal that already
 * holds a document gets none.
 */
final class DocumentsSeeder extends Seeder
{
    public function run(Actor $author): void
    {
        if (Document::query()->exists()) {
            return;
        }

        $document = Document::create($author);

        $document->startWith(DocumentRevision::create(
            $document,
            'How the plans page reads',
            'What a plan card shows and how its phases open.',
            "# How the plans page reads\n\n## The list\n\nEach plan is one row with its type, its state and how many of its tasks are done.\n\n## The reader\n\nOpening a plan shows its phases in order, each with its tasks.\n",
            $author->actorType(),
            $author->actorId(),
        ));
    }
}
