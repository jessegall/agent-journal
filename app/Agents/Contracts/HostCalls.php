<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\CallSignatureInvalid;
use App\Agents\Exceptions\HostCredentialRejected;
use App\Agents\Exceptions\HostProtocolMismatch;
use App\Agents\Values\HostContext;
use Illuminate\Http\Request;

/**
 * What other areas use of Agents to admit a host's signed call: the host and envelope it was signed as.
 */
interface HostCalls
{
    /**
     * The host and envelope of a call speaking one of these protocols, with the protocol it spoke.
     *
     * @throws HostCredentialRejected
     * @throws CallSignatureInvalid
     * @throws HostProtocolMismatch
     */
    public function verify(Request $request, HostProtocolVersion ...$spoken): HostContext;
}
