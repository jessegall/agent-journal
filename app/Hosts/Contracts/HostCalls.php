<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Exceptions\HostCredentialRejected;
use App\Hosts\Exceptions\ApiSignatureInvalid;
use App\Hosts\Exceptions\HostRoleRefused;
use App\Hosts\Values\HostContext;
use Illuminate\Http\Request;

/**
 * What other areas use of Agents to admit a host's signed call: the host and envelope it was signed as.
 */
interface HostCalls
{
    /**
     * The host and envelope of a signed call.
     *
     * @throws HostCredentialRejected
     * @throws ApiSignatureInvalid
     */
    public function verify(Request $request): HostContext;

    /**
     * The host and envelope of a signed call from the relay of a connected folder.
     *
     * @throws HostCredentialRejected
     * @throws ApiSignatureInvalid
     * @throws HostRoleRefused
     */
    public function verifyRelay(Request $request): HostContext;
}
