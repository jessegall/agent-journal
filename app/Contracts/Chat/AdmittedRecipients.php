<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

/**
 * The users the journal admits, read as an audience to tell that something changed; it grants nothing.
 */
interface AdmittedRecipients
{
    /**
     * @return list<string>
     */
    public function userIds(): array;
}
