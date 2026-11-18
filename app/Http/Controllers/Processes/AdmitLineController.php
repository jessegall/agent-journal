<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Http\Requests\Processes\AdmitLineRequest;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Values\AdmissionRefusal;
use Illuminate\Http\JsonResponse;

/**
 * Admits a line an agent runs directly through the same admission every hook uses: the queued run to start, or the
 * refusal with its correction and the request that holds the work.
 */
final readonly class AdmitLineController
{
    public function __invoke(AdmitLineRequest $request, ShellAdmission $admissions): JsonResponse
    {
        $admission = $admissions->admit(
            $request->line(),
            $request->dialect(),
            $request->context(),
            $request->requestKey(),
        );
        $refusal = $admission->decision;
        if (! $refusal instanceof AdmissionRefusal) {
            return new JsonResponse(['allowed' => true, 'run_id' => $admission->runId]);
        }

        return new JsonResponse([
            'allowed' => false,
            'code' => $refusal->code->value,
            'node' => $refusal->node,
            'excerpt' => $refusal->excerpt,
            'reason' => $refusal->reason,
            'correction' => $refusal->correction,
            'request_id' => $refusal->requestId,
            'next' => $refusal->next,
            'notice' => AdmissionRefusal::NOTICE,
        ]);
    }
}
