$(function () {
    var currentTable = '#table1';
    $('.select').click(function () {
        var tableNumber = $(this).text();
        currentTable = '#table' + tableNumber;
        timeoutHandle = '';
        $('.select').removeClass('btn-primary');
        $(this).addClass('btn-primary');

        $('div').css('display', 'none');
        $(currentTable).css('display', 'block');

        switch (state.stateNumber) {
            case 5:
            case 7:
            case 8: {
                $('#table2 .save').toggleClass('btn-danger');
                $('#table2 .save').text('Start');
                $('#table2 .result').text('=');
                break;
            }
        }
        initState();
    });

    function inCurrentTable(input) {
        return currentTable + ' ' + input;
    }

    // state
    // implement calculator by using finite state machine.
    // state = 0 => initial state
    // state = 1 => left operand is changed
    // state = 2 => left operand and operator are changed.
    // state = 3 => left operand, right operand and operator are changed.
    // state = 4 => result is pushed.
    var state = {
        leftOperand: '',
        rightOperand: '',
        operator: '',
        clearState: 'C',
        stateNumber: 0,
    };

    var memory = 0;
    var history = '';
    var equation = '';
    var equationList = [];
    var timeoutHandle = '';

    function initState() {
        state.leftOperand = '';
        state.rightOperand = '';
        state.operator = '';
        state.clearState = 'C';
        state.stateNumber = 0;

        history = '';
        equation = '';
        equationList = [];
        $('.clear').text(state.clearState);
        $('#output').attr('value', 0);
        $('#intermediate').text("");

        if (timeoutHandle !== '') {
            clearTimeout(timeoutHandle);
            timeoutHandle = '';
        }
    }

    // memory state 
    $('.mRecall').click(function () {
        state.clearState = 'CE';
        $('.clear').text(state.clearState);

        if (timeoutHandle !== '') {
            clearTimeout(timeoutHandle);
            timeoutHandle = setTimeout(function () {
                $(operatorToString(state.operator)).click();
            }, 1000 * parseFloat($('#timeout').val(), 10));
        }

        switch (state.stateNumber) {
            case 0:
            case 1: {
                // init ,state1 -> state1
                state.stateNumber = 1;

                state.leftOperand = memory;
                $('#output').attr('value', memory);
                break;
            }
            case 2:
            case 3: {
                // state2, state3 -> state3
                state.stateNumber = 3;

                state.rightOperand = memory;
                $('#output').attr('value', memory);
                break;
            }
            case 4: {
                // state4 -> state1
                state.stateNumber = 1;

                state.operator = '';
                state.rightOperand = '';
                state.leftOperand = memory;
                $('#output').attr('value', memory);
                break;
            }
        }
    });

    $('.mPlus').click(function () {
        switch (state.stateNumber) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                var number = $('#output').attr('value');
                memory += parseInt(number, 10);

                $('#memory').attr('value', memory);

        }
    });

    $('.mMinus').click(function () {
        switch (state.stateNumber) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                var number = $('#output').attr('value');
                memory -= parseInt(number, 10);

                $('#memory').attr('value', memory);
        }
    });

    $('.mClear').click(function () {
        memory = 0;

        $('#memory').attr('value', memory);
    })

    function operatorToString(op) {
        switch (op) {
            case '+': return '#add';
            case '-': return '#sub';
            case '*': return '#mul';
            case '/': return '#div';
        }
    }

    // calculator state
    $('.number').click(function () {
        var number = $(this).text();

        state.clearState = 'CE';
        $('.clear').text(state.clearState);

        if (timeoutHandle !== '') {
            clearTimeout(timeoutHandle);
            timeoutHandle = setTimeout(function () {
                $(operatorToString(state.operator)).click();
            }, 1000 * parseFloat($('#timeout').val(), 10));
        }

        switch (state.stateNumber) {
            case 0:
            case 1: {
                // init ,state1 -> state1
                state.stateNumber = 1;

                var input = $('#output').attr('value');
                if (input === '0')
                    input = number;
                else
                    input += number;
                state.leftOperand = parseInt(input);
                $('#output').attr('value', input);
                break;
            }
            case 2: {
                // state2 -> state3
                state.stateNumber = 3;

                state.rightOperand = parseInt(number);
                $('#output').attr('value', number);
                break;
            }
            case 3: {
                // state3 -> state3
                state.stateNumber = 3;

                var input = $('#output').attr('value');
                if (input === '0')
                    input = number;
                else
                    input += number;
                state.rightOperand = parseInt(input);
                $('#output').attr('value', input);
                break;
            }
            case 4: {
                // state4 -> state1
                state.stateNumber = 1;

                state.operator = '';
                state.rightOperand = '';
                state.leftOperand = parseInt(number, 10);
                $('#output').attr('value', number);
                break;
            }
            case 5: {
                // state5 -> state8
                state.stateNumber = 8;
                equation = number;
                equationList[equationList.length] = number;
                $('#output').attr('value', equation);
                break;
            }
            case 7: {
                // state7 -> state8
                state.stateNumber = 8;
                equation = $('#output').attr('value');
                equation += ' ' + number;
                equationList[equationList.length] = state.operator;
                equationList[equationList.length] = number;
                $('#output').attr('value', equation);
                break;
            }
            case 8: {
                equation = $('#output').attr('value');
                if (equationList[equationList.length - 1] === '0') {
                    equationList[equationList.length - 1] = number
                    equation = equation.substr(0, equation.length - 1) + number;
                } else {
                    equation += number;
                    equationList[equationList.length - 1] += number;
                }
                $('#output').attr('value', equation);
                break;
            }
        }
    });

    $('.operator').click(function () {
        var operator = $(this).text();

        state.clearState = 'CE';
        $('.clear').text(state.clearState);

        if (timeoutHandle !== '') {
            clearTimeout(timeoutHandle);
        }

        switch (state.stateNumber) {
            case 0: {
                // init -> state2
                state.stateNumber = 2;

                state.leftOperand = 0;
                state.operator = operator;
                history += state.leftOperand + ' ' + state.operator + ' ';
                $('#intermediate').text(history);
                break;
            }
            case 1: {
                // state1 -> state2
                state.stateNumber = 2;

                state.operator = operator;
                history += state.leftOperand + ' ' + state.operator + ' ';
                $('#intermediate').text(history);
                break;
            }
            case 2: {
                state.operator = operator;
                history = history.substr(0, history.length - 2) + operator + ' ';
                $('#intermediate').text(history);
                break;
            }
            case 3: {
                // state3 -> state2
                state.stateNumber = 2;

                state.leftOperand = operate(state);
                state.operator = operator;
                $('#output').attr('value', state.leftOperand);
                history += state.rightOperand + ' ' + state.operator + ' ';
                $('#intermediate').text(history);
                state.rightOperand = '';
                break;
            }
            case 4: {
                // state4 -> state2
                state.stateNumber = 2;

                state.operator = operator;
                state.rightOperand = '';
                history += state.leftOperand + ' ' + state.operator + ' ';
                $('#intermediate').text(history);
                break;
            }
            case 7: {
                state.operator = operator;
                $('#output').attr('value', equation + ' ' + operator);
                break;
            }
            case 8: {
                // state8 -> state7
                state.stateNumber = 7;
                state.operator = operator;
                $('#output').attr('value', equation + ' ' + operator);
                break;
            }
        }
    });

    $('#table3 .operator').dblclick(function () {
        timeoutHandle = setTimeout(function () {
            console.log('timeout');
        }, 1000);
    });

    $('.result').click(function () {
        switch (state.stateNumber) {
            case 0:
            case 1: {
                // init, state1 -> init, state1 respectively
                break;
            }
            case 2: {
                // state2 -> state4
                state.stateNumber = 4;

                if (timeoutHandle !== '') {
                    appendHistory(history.substr(0, history.length - 2) + " = " + state.leftOperand);
                    state.rightOperand = state.leftOperand;
                    history = '';
                } else {
                    state.rightOperand = state.leftOperand;
                    var result = operate(state);
                    $('#output').attr('value', result);
                    appendHistory(makeResult(state, result));
                    history = '';
                    state.leftOperand = result;
                }

                state.clearState = 'CE';
                $('.clear').text(state.clearState);
                $('#intermediate').text(history);
                break;
            }
            case 3: {
                // state3-> state4
                state.stateNumber = 4;

                var result = operate(state);
                $('#output').attr('value', result);
                appendHistory(makeResult(state, result));
                history = '';
                state.leftOperand = result;

                state.clearState = 'CE';
                $('.clear').text(state.clearState);
                $('#intermediate').text(history);
                break;
            }
            case 4: {
                // state4 -> state4
                var result = operate(state);
                $('#output').attr('value', result);
                history = state.leftOperand + ' ' + state.operator + ' ';
                appendHistory(makeResult(state, result));
                history = '';
                state.leftOperand = result;

                state.clearState = 'CE';
                $('.clear').text(state.clearState);
                $('#intermediate').text(history);
                break;
            }
            case 8: {
                if (equationList.length !== 1) {
                    $('.save').toggleClass('btn-danger');
                    $('.save').text('Start');
                    appendEquation(equationList);
                    $(this).text('=');
                    initState();
                }
                break;
            }
        }
        if (timeoutHandle !== '') {
            clearTimeout(timeoutHandle);
            timeoutHandle = '';
        }
        $('#intermediate').text("");
    });

    function makeResult(state, result) {
        return history + " " + state.rightOperand + " = " + result;
    }

    function appendHistory(h) {
        var $li = $('<li>').text(h)
        $li.append(
            $('<button>')
                .text('delete')
                .click(function () {
                    $li.remove();
                })
        )
        $('#history').append($li)
    }

    $('.clear').click(function () {
        switch (state.stateNumber) {
            case 0:
            case 1: {
                // init, state1 -> init
                initState();
                break;
            }
            case 2:
            case 3:
            case 4: {
                if (state.clearState === 'CE') {
                    state.clearState = 'C'
                    $('#output').attr('value', 0);
                    $('.clear').text(state.clearState);
                    if (timeoutHandle !== '') {
                        clearTimeout(timeoutHandle);
                    }
                } else {
                    initState();
                }
                break;
            }
            case 5:
            case 7:
            case 8: {
                initState();
                state.stateNumber = 5;
            }
        }
    });

    function operate(state) {
        leftOperand = state.leftOperand;
        rightOperand = state.rightOperand;
        operator = state.operator;

        switch (operator) {
            case '+': return leftOperand + rightOperand;
            case '-': return leftOperand - rightOperand;
            case '*': return leftOperand * rightOperand;
            case '/': return leftOperand / rightOperand;
        }
    }

    $('.save').click(function () {
        if ($(this).text() === 'Start') {
            $(this).text('Cancel');
            $('#table2 .result').text('Save');
            $(this).toggleClass('btn-danger');
            initState();
            state.stateNumber = 5;
        } else {
            switch (state.stateNumber) {
                case 5:
                case 7:
                case 8: {
                    $(this).toggleClass('btn-danger');
                    $(this).text('Start');
                    $('#table2 .result').text('=');
                    initState();
                    break;
                }
            }
        }
    });

    function appendEquation(e) {
        var $li = $('<li>');
        for (var i = 0; i < e.length; i++) {
            if (!isOperator(e[i])) {
                $li.append($('<input class="nInput" type="text" value="0">')
                    .attr('value', (parseInt(e[i], 10))));
            } else {
                $li.append(e[i]);
            }
        }
        $li.append(' = ');
        $li.append($('<input class="nInput" type="text" value="0" readonly>'));

        var computeButton = $('<button>')
            .text('compute')
            .click(function () {
                var i;
                var result = 0;
                var currentOperator = '';
                for (i = 0; i < e.length; i++) {
                    if (!isOperator(e[i])) {
                        result = operate2(result, this.parentNode.childNodes[i].value, currentOperator);
                    } else {
                        currentOperator = this.parentNode.childNodes[i].textContent;
                    }
                }
                this.parentNode.childNodes[i + 1].value = result;
            })
        $li.append(computeButton);
        computeButton.click();
        $li.append(
            $('<button>')
                .text('delete')
                .click(function () {
                    $li.remove();
                })
        );
        $('#equation').append($li)
    };

    function operate2(leftOperand, rightOperand, operator) {
        leftOperand = parseInt(leftOperand, 10);
        rightOperand = parseInt(rightOperand, 10);
        switch (operator) {
            case '+': return leftOperand + rightOperand;
            case '-': return leftOperand - rightOperand;
            case '*': return leftOperand * rightOperand;
            case '/': return leftOperand / rightOperand;
            case '': return rightOperand;
        }
    }

    function isOperator(operator) {
        return operator === '+' || operator === '-' || operator === '*' || operator === '/';
    }
})
