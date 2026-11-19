<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\SessionResolver;
use App\Agents\Support\SessionOption;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Api\Events\RecordDockChanged;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\RecordDock;
use Domain\Documents\Models\Report;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Docks and hides record cards in a session the actor may use: a user any running session, an agent only its own.
 */
final readonly class Docking
{
    public function __construct(private SessionResolver $sessions, private CurrentActor $actors, private CurrentSession $session, private Dispatcher $events) {}

    public function dockDocument(int $number, string $sessionId): void
    {
        $this->dock($this->documentOf($number), $sessionId);
    }

    public function dockReport(int $number, string $sessionId): void
    {
        $this->dock($this->reportOf($number), $sessionId);
    }

    public function hideDocument(int $number, string $sessionId): void
    {
        $this->hide($this->documentOf($number), $sessionId);
    }

    public function hideReport(int $number, string $sessionId): void
    {
        $this->hide($this->reportOf($number), $sessionId);
    }

    /**
     * Docks a record an agent just created in its session, inside the creating transaction, when that session is
     * verified running; a user's creation, or one with no running session, docks nothing and still succeeds.
     */
    public function dockInCreatorSession(RecordIdentity $record): void
    {
        if ($this->actors->actor()->actorType() !== ActorType::Agent) {
            return;
        }

        $sessionId = $this->session->sessionId();
        $running = array_map(fn (SessionOption $session) => $session->sessionId, $this->sessions->active());

        if (in_array($sessionId, $running, true)) {
            $this->dock($record, $sessionId);
        }
    }

    /**
     * Docks the record for the agent the session belongs to: the session only says which agent the dock is for.
     */
    private function dock(RecordIdentity $record, string $sessionId): void
    {
        $recipient = $this->sessions->requireActive($sessionId)->actorIdentity();
        RecordDock::dockIn($recipient, $record, $this->actors->actor());
        $this->events->dispatch(new RecordDockChanged($recipient, $record->type, $record->id));
    }

    private function hide(RecordIdentity $record, string $sessionId): void
    {
        $recipient = $this->sessions->requireActive($sessionId)->actorIdentity();
        RecordDock::hideIn($recipient, $record);
        $this->events->dispatch(new RecordDockChanged($recipient, $record->type, $record->id));
    }

    private function documentOf(int $number): RecordIdentity
    {
        $document = Document::query()->sharedPublished()->where('number', $number)->first() ?? throw DocumentMissing::numbered($number);

        return new RecordIdentity(Document::LINK_TYPE, $document->id);
    }

    private function reportOf(int $number): RecordIdentity
    {
        $report = Report::query()->sharedPublished()->where('number', $number)->first() ?? throw ReportMissing::numbered($number);

        return new RecordIdentity(Report::LINK_TYPE, $report->id);
    }
}
