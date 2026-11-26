<?php

declare(strict_types=1);

namespace Domain\Documents\Database\Seeders;

use App\Contracts\Actors\Actor;
use App\Values\ProjectOwner;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Illuminate\Database\Seeder;

/**
 * The design's sample document by the owner, so the running app shows a document row and its reader with what the
 * published design draws and a design comparison compares like with like. A journal that already holds it gets none.
 */
final class DocumentsSeeder extends Seeder
{
    private const string TITLE = 'Design: Home, version 6';

    private const string ABSTRACT = 'The chat alone, and how it grows into an IDE-like Home.';

    private const string BODY = <<<'MARKDOWN'
        ### The chat, and only the chat

        Home is the chat until the user asks for more. The chat column, its cards and the composer keep to a reading width however wide the window is.

        ### Growing by hand

        A window pushed past an edge of Home docks along that side; dropped on a pane's compass it splits that pane or joins its tabs. Panes share edges the user drags.

        - Docking is tiling on the pane grid, version 6's paneLayout.ts.
        - Floating is for a window taken out of the grid.
        - Every piece of the IDE-like end is added this way.

        ### One signal per fact

        The agent bar owns the agent's state; the question card's Answer says it waits on you; the bell in the topbar is the only bell.
        MARKDOWN;

    public function run(Actor $author): void
    {
        if (DocumentRevision::query()->withTitle(self::TITLE)->exists()) {
            return;
        }

        $document = Document::create($author, ProjectOwner::global());

        $document->startWith(DocumentRevision::create(
            $document,
            self::TITLE,
            self::ABSTRACT,
            self::BODY."\n",
            $author->actorType(),
            $author->actorId(),
        ));
    }
}
