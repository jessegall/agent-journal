<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use App\Connections\Commands\IssueProjectInvitation;
use App\Connections\Values\InstallTicket;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner's ask for an install line: the key of the action it belongs to, so asking again replaces the line, and
 * the connected project to join, or none for a new project.
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
        ];
    }

    /**
     * The command for a new line, carrying only the digest of its ticket.
     */
    public function commandFor(InstallTicket $ticket): IssueProjectInvitation
    {
        return new IssueProjectInvitation($ticket->digest(), $this->issuanceKey(), $this->projectId());
    }

    public function issuanceKey(): string
    {
        return $this->string('issuanceKey')->toString();
    }

    public function projectId(): string|null
    {
        return $this->filled('projectId') ? $this->string('projectId')->toString() : null;
    }
}
