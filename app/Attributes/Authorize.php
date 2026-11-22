<?php

declare(strict_types=1);

namespace App\Attributes;

use App\Contracts\Policy;
use App\Enums\AccessType;
use Attribute;

/**
 * The one declaration of an application command: the policy that guards it and the access it asks for.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class Authorize
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public string $policy, public AccessType $access) {}

    /**
     * The declaration as an audit line's fields: the policy, the model it guards and the access.
     *
     * @return array{policy: class-string<Policy>, model: string, access: string}
     */
    public function auditFields(): array
    {
        return ['policy' => $this->policy, 'model' => $this->policy::model(), 'access' => $this->access->value];
    }
}
