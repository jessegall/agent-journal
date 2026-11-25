<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\RecordIdentity;
use Domain\Plans\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Assigning or reassigning a plan's work from its page: the plan by its route number, the chosen recipient, and for a
 * reassignment the holder and reference the dispatcher saw, so a newer holder is not overwritten.
 */
final class PlanWorkRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'recipient_type' => ['required', 'string', 'in:agent,user'],
            'recipient_id' => ['required', 'string', 'max:64'],
            'expected_reference' => ['sometimes', 'string', 'max:64'],
            'expected_holder_type' => ['sometimes', 'string', 'in:agent,user'],
            'expected_holder_id' => ['sometimes', 'string', 'max:64'],
        ];
    }

    public function workRoot(): RecordIdentity
    {
        $planId = Plan::idOfNumber($this->routeNumber('plan')) ?? throw new NotFoundHttpException();

        return new RecordIdentity(Plan::linkType(), $planId);
    }

    public function recipient(): AssigneeIdentity
    {
        return new AssigneeIdentity(
            $this->string('recipient_type')->toString(),
            $this->string('recipient_id')->toString(),
        );
    }

    public function expectedRoot(): AssignmentReference
    {
        return new AssignmentReference(
            $this->string('expected_reference')->toString(),
            new AssigneeIdentity(
                $this->string('expected_holder_type')->toString(),
                $this->string('expected_holder_id')->toString(),
            ),
        );
    }
}
