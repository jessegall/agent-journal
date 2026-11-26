<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use Illuminate\Database\Eloquent\Model;

/**
 * An authored record that is an Eloquent model, so its alias in the morph map and its key can be read from it; only a
 * model implements it.
 *
 * @mixin Model
 */
interface AuthoredModel extends AuthoredRecord {}
