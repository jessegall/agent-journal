<?php

declare(strict_types=1);

namespace Tests\Support\Connections;

use App\Contracts\Bus\CommandRefusal;
use App\Http\Controllers\IssueProjectInvitationController;
use Inertia\Support\SessionKey;

/**
 * The owner asks for install lines as the Connect window does, by a page action whose answer is a one-time flash.
 */
trait IssuesInstallLines
{
    /**
     * Issues an install line as the window does, by a page action, and answers what the window receives as its one-time
     * flash: the line, its invitation and its attempt.
     *
     * @param  array<string, string|int|null>  $body
     * @return array<string, mixed>
     */
    private function issuedLine(array $body): array
    {
        $issued = $this->actingAs($this->owner)->from('/connections')->post('/project-connections/invitations', $body)
            ->assertRedirect('/connections')
            ->assertSessionHasNoErrors();

        return $issued->getSession()->get(SessionKey::FLASH_DATA)[IssueProjectInvitationController::ISSUED_LINE];
    }

    /**
     * Asks for an install line that the server refuses, and answers the refusal's code the window is shown.
     *
     * @param  array<string, string|int|null>  $body
     */
    private function refusedLine(array $body): string
    {
        $refused = $this->actingAs($this->owner)->from('/connections')->post('/project-connections/invitations', $body)
            ->assertRedirect('/connections')
            ->assertSessionHasErrors();

        return $refused->getSession()->get(CommandRefusal::CODE_FLASH_KEY);
    }
}
