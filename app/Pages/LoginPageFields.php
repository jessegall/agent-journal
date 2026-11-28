<?php

declare(strict_types=1);

namespace App\Pages;

use App\Accounts\Data\LoginInput;
use App\Web\Creation\Exceptions\MissingFields;

final class LoginPageFields
{
    private LoginInput $input;

    public function input(LoginInput $input): self
    {
        $this->input = $input;

        return $this;
    }

    public function finish(): LoginPage
    {
        if (! isset($this->input)) {
            throw MissingFields::forType(LoginPage::class, 'input');
        }

        return new LoginPage(
            input: $this->input,
        );
    }
}
