<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use App\Projects\Commands\IssueProjectInvitation\IssueProjectInvitationCommand;
use App\Projects\Values\InstallTicket;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner's ask for an install line: the key of the action it belongs to, so asking again replaces the line, the
 * connected project to join, or none for a new project, and, to replace the line of an attempt the owner holds, its
 * reference and the version the owner saw.
 */
final class IssueProjectInvitationRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'issuanceKey' => ['required', 'string', 'max:64', 'regex:/^[A-Za-z0-9_-]+$/'],
            'projectId' => ['nullable', 'string', 'ulid'],
            'environmentId' => ['nullable', 'required_with:projectId', 'string', 'ulid'],
            'attemptReference' => ['nullable', 'string', 'max:32', 'regex:/^IA-[A-Z0-9]+$/'],
            'seenVersion' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * The command for a new line, carrying only the digest of its ticket.
     */
    public function commandFor(InstallTicket $ticket): IssueProjectInvitationCommand
    {
        return new IssueProjectInvitationCommand(
            $ticket->digest(),
            $this->issuanceKey(),
            $this->projectId(),
            $this->environmentId(),
            $this->attemptReference(),
            $this->seenVersion(),
        );
    }

    public function issuanceKey(): string
    {
        return $this->string('issuanceKey')->toString();
    }

    public function environmentId(): string|null
    {
        if ($this->filled('environmentId')) {
            return $this->string('environmentId')->toString();
        }

        return null;
    }

    public function attemptReference(): string|null
    {
        if ($this->filled('attemptReference')) {
            return $this->string('attemptReference')->toString();
        }

        return null;
    }

    public function seenVersion(): int|null
    {
        if ($this->filled('seenVersion')) {
            return $this->integer('seenVersion');
        }

        return null;
    }

    public function projectId(): string|null
    {
        if ($this->filled('projectId')) {
            return $this->string('projectId')->toString();
        }

        return null;
    }
}
