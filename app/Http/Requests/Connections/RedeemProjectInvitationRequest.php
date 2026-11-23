<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use App\Commands\RedeemProjectInvitation\RedeemProjectInvitationCommand;
use App\Values\BindingFolder;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A relay's redemption of an install line, accepted over TLS only: the ticket, the credential its host will sign
 * with and the folder it connects.
 */
final class RedeemProjectInvitationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->isSecure();
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'ticket' => ['required', 'string', 'max:128', 'regex:/^[A-Za-z0-9_-]+$/'],
            'installationNonce' => ['required', 'string', 'min:16', 'max:128'],
            'hostCredential' => ['required', 'string', 'min:32', 'max:256'],
            'rootId' => ['required', 'string', 'max:128'],
            'canonicalRoot' => ['required', 'string', 'max:4096', 'starts_with:/'],
            'projectLabel' => ['required', 'string', 'max:200'],
            'machineLabel' => ['required', 'string', 'max:200'],
        ];
    }

    public function command(): RedeemProjectInvitationCommand
    {
        return new RedeemProjectInvitationCommand(
            $this->string('ticket')->toString(),
            $this->string('hostCredential')->toString(),
            $this->string('projectLabel')->toString(),
            new BindingFolder(
                $this->string('rootId')->toString(),
                $this->string('canonicalRoot')->toString(),
                $this->string('machineLabel')->toString(),
                $this->string('installationNonce')->toString(),
            ),
        );
    }
}
