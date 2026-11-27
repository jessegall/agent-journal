<?php

declare(strict_types=1);

namespace Tests\Fixtures\Names\Plans;

use Tests\Fixtures\Names\Chat\Message;

final class ConstructionUse
{
    /**
     * @return list<Message>
     */
    public function messages(): array
    {
        return [new Message(), new class extends Message {}];
    }
}
