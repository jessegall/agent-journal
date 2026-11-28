<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Web\Attributes\QueryInput;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

final class AccountsInput extends Data
{
    public function __construct(
        #[QueryInput('account'), Nullable, Max(26)]
        public readonly string|null $account = null,
        #[QueryInput('add'), BooleanType, WithCast(AccountAddCast::class)]
        public readonly bool $add = false,
        #[QueryInput('page'), IntegerType, Min(1)]
        public readonly int $page = 1,
        #[QueryInput('usage_page'), IntegerType, Min(1)]
        public readonly int $usagePage = 1,
    ) {}
}
