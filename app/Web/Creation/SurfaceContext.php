<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Access\Contracts\JournalAdmission;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentUserResolver;
use App\Actors\CurrentUser;
use App\Declarations\SlotContext;
use App\Exceptions\PrivateRecordMissing;
use App\Exceptions\RecordUnavailable;
use App\Exceptions\StackTargetRefused;
use App\Projects\Contracts\CurrentProject;
use App\Records\Contracts\RecordResolver;
use App\Sessions\Contracts\AgentDirectory;
use App\Sessions\Contracts\CurrentSession;
use App\Sessions\Contracts\SessionResolver;
use App\Support\ActorReference;
use App\Support\HomeAgent;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Values\ProjectSelection;
use App\Values\StackTarget;
use App\Web\RouteNumber;
use App\Web\Values\WindowInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final readonly class SurfaceContext
{
    public function __construct(
        private Request $visit,
        private CurrentActor $actors,
        private JournalAdmission $admission,
        private CurrentSession $sessions,
        private CurrentProject $projects,
        private CurrentUserResolver $users,
        private AgentDirectory $agents,
        private SessionResolver $visibleSessions,
        private RecordResolver $records,
        public WindowInstance|null $window = null,
        public SlotContext|null $slot = null,
        public RecordIdentity|null $inspector = null,
    ) {}

    public function actor(): ActorReference|null
    {
        return $this->actors->hasActor() ? $this->actors->actor() : null;
    }

    public function activeAgent(): ActorReference|null
    {
        $actor = $this->actor();

        return $actor instanceof ActorReference && $actor->isAgent() ? $actor : null;
    }

    public function owner(): ActorReference|null
    {
        $owner = $this->admission->owner();

        return $owner->isUser() ? $owner : null;
    }

    public function session(): string|null
    {
        return $this->sessions->hasSession() ? $this->sessions->sessionId() : null;
    }

    public function project(): ProjectSelection
    {
        return $this->projects->selection();
    }

    public function viewer(): CurrentUser|null
    {
        return $this->users->currentUser()->getOrElse(null);
    }

    public function queryValue(string $key): mixed
    {
        return $this->visit->query->all()[$key] ?? null;
    }

    public function routeKey(string $parameter): string|null
    {
        $key = $this->visit->route($parameter);

        return is_string($key) || is_int($key) ? (string) $key : null;
    }

    public function routeModel(string $parameter, string $recordType): Model|null
    {
        $key = $this->routeKey($parameter);

        if ($key === null) {
            return null;
        }

        try {
            $identity = Str::isUlid($key)
                ? RecordIdentity::from(['type' => $recordType, 'id' => strtolower($key)])
                : $this->records->identify(RecordReference::of($recordType, RouteNumber::of($key)));

            return $this->records->requireReadable($identity);
        } catch (RecordUnavailable $refusal) {
            throw PrivateRecordMissing::forReader($refusal);
        }
    }

    public function chosenAgent(string $key): HomeAgent|null
    {
        $id = $this->queryId($key);

        if ($id === null) {
            return null;
        }

        try {
            return $this->agents->visibleAgent($id);
        } catch (StackTargetRefused $refusal) {
            throw PrivateRecordMissing::forReader($refusal);
        }
    }

    public function chosenSession(string $key): string|null
    {
        return $this->chosenSessionTarget($key)?->sessionId;
    }

    public function chosenSessionTarget(string $key): StackTarget|null
    {
        $id = $this->queryId($key);

        if ($id === null) {
            return null;
        }

        try {
            return $this->visibleSessions->requireActive($id);
        } catch (StackTargetRefused $refusal) {
            throw PrivateRecordMissing::forReader($refusal);
        }
    }

    public function queryId(string $key): string|null
    {
        $id = $this->queryValue($key);

        if ($id === null) {
            return null;
        }

        if (! is_string($id) || ! Str::isUlid($id)) {
            throw ValidationException::withMessages([$key => 'Enter a valid identifier.']);
        }

        return strtolower($id);
    }
}
