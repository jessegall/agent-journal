<?php

declare(strict_types=1);

namespace App\Http\Requests\Connections;

use App\Support\ServerOrigin;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A relay's signed ask, over TLS only, for the binding its installation nonce made, after the reply to its redemption
 * was lost.
 */
final class RecoverBindingRequest extends FormRequest
{
    /**
     * Only over https, or plain http while the journal runs locally for a test on this machine or network.
     */
    public function authorize(ServerOrigin $origin): bool
    {
        return $this->isSecure() || $origin->admitsPlainHttp();
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return ['installationNonce' => ['required', 'string', 'min:16', 'max:128']];
    }

    public function installationNonce(): string
    {
        return $this->string('installationNonce')->toString();
    }
}
