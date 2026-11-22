<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Support\ReadToolSearchAccess;
use App\Values\OpenAction;
use App\Values\RecordLocation;
use Domain\Documents\Values\PublicationPassage;

/**
 * Who may search reports: an agent whose grant holds reports_read for at least one, limited to those, and every
 * signed-in user of the environment; a hit opens through reports_read, a passage hit at its line.
 */
final readonly class ReportSearchAccess extends ReadToolSearchAccess
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
        return 'reports_read';
    }

    protected function idArgument(): string
    {
        return 'report_id';
    }
}
