<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Search\Values\OpenAction;
use App\Search\Values\RecordLocation;
use App\Support\ReadToolSearchAccess;
use Domain\Documents\Values\PublicationPassage;

/**
 * Who may search a published text, a document or a report, through its read tool: a hit opens through that tool,
 * and a passage hit at the line and revision it was found in.
 */
abstract readonly class PublicationSearchAccess extends ReadToolSearchAccess
{
    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        $passage = self::passageAt($location);

        if ($passage === null) {
            return parent::openAction($recordId, $location);
        }

        return new OpenAction($this->readName(), [$this->idArgument() => $recordId, ...$passage->readArguments()]);
    }

    /**
     * A passage opens the page at the revision it was found in, when it names one.
     *
     * @return array<string, string>
     */
    public function pageQuery(RecordLocation|null $location): array
    {
        $revision = self::passageAt($location)?->revision;

        if ($revision === null) {
            return [];
        }

        return ['revision' => (string) $revision];
    }

    /**
     * The passage the location names; none for no location or one that names no passage.
     */
    private static function passageAt(RecordLocation|null $location): PublicationPassage|null
    {
        if ($location === null || ! PublicationPassage::isId($location->id)) {
            return null;
        }

        return PublicationPassage::fromId($location->id);
    }
}
