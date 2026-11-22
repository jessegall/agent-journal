<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Support\ReadToolSearchAccess;
use App\Values\OpenAction;
use App\Values\RecordLocation;
use Domain\Documents\Values\PublicationPassage;

/**
 * Who may search documents: an agent whose grant holds docs_read for at least one, limited to those, and every
 * signed-in user of the environment; a hit opens through docs_read, a passage hit at its line.
 */
final readonly class DocumentSearchAccess extends ReadToolSearchAccess
{
    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        if ($location === null || ! PublicationPassage::isId($location->id)) {
            return parent::openAction($recordId, $location);
        }

        $passage = PublicationPassage::fromId($location->id);

        return new OpenAction($this->readName(), [$this->idArgument() => $recordId, ...$passage->readArguments()]);
    }

    protected function readName(): string
    {
        return 'docs_read';
    }

    protected function idArgument(): string
    {
        return 'doc_id';
    }

    /**
     * A passage opens the page at the revision it was found in, when it names one.
     *
     * @return array<string, string>
     */
    public function pageQuery(RecordLocation|null $location): array
    {
        if ($location === null || ! PublicationPassage::isId($location->id)) {
            return [];
        }

        $revision = PublicationPassage::fromId($location->id)->revision;

        return $revision === null ? [] : ['revision' => (string) $revision];
    }
}
