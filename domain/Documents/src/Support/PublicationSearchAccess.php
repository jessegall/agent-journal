<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Support\ReadToolSearchAccess;
use App\Values\OpenAction;
use App\Values\RecordLocation;
use Domain\Documents\Values\PublicationPassage;

/**
 * Who may search a published text, a document or a report, through its read tool: a hit opens through that tool,
 * and a passage hit at the line and revision it was found in.
 */
abstract readonly class PublicationSearchAccess extends ReadToolSearchAccess
{
    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        if ($location === null || ! PublicationPassage::isId($location->id)) {
            return parent::openAction($recordId, $location);
        }

        $passage = PublicationPassage::fromId($location->id);

        return new OpenAction($this->readName(), [
            $this->idArgument() => $recordId,
            ...$passage->readArguments(),
        ]);
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

        if ($revision === null) {
            return [];
        }

        return ['revision' => (string) $revision];
    }
}
