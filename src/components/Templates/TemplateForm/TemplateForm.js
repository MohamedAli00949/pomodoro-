import React, { useState, lazy, Suspense } from 'react';

import { CgClose, CgTimelapse } from 'react-icons/cg';
import { AiOutlineInfo, AiFillSound } from 'react-icons/ai';

import './style.css'

import Message from '../../../utils/Message';
import NetworkError from '../../NetworkError/NetworkError';
import FormFooter from './FormFooter/FormFooter';

const TodoList = lazy(() => import('../../../icons/list/TodoList'));
const InfoStep = lazy(() => import('./InfoStep/InfoStep'));
const TasksStep = lazy(() => import('./TasksStep/TasksStep'));
const TimerStep = lazy(() => import('./TimerStep/TimerStep'));
const SoundStep = lazy(() => import('./SoundStep/SoundStep'));

/*
  {
    "_id": "649a0d04948697c38349a936",
    "name": "New Template",
    // "visibility": false,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Sed tempus tortor iaculis, interdum justo eget, dignissim nunc. Morbi sagittis, 
      felis quis vehicula dapibus, sapien ex imperdiet eros, a scelerisque nunc magna id nisl. 
      Fusce porttitor posuere erat. Vivamus efficitur sapien enim, vel fringilla mi semper sed. 
      Suspendisse facilisis felis sed est lobortis fermentum. Phasellus sit amet lobortis est. 
      Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.jdsj",
    "tasks": [
      "649a0d04948697c38349a938",
      "649a0d04948697c38349a939",
      "649a0d04948697c38349a93a"
    ],
    "userId": "64418d46391fa556399c6a0f",
    "est": 60,
    "act": 0,
    // "color": "#ef9b0f",
    // "usedBy": 1,
    "time": {
        "PERIOD": 1500,
        "SHORT": 300,
        "LONG": 900
    },
    // "timeForAll": true,
    "autoBreaks": false,
    "autoPomodors": false,
    "autoStartNextTask": false,
    "longInterval": 4,
    "alarmType": {
        "name": "alarm 1",
        "src": "sounds/alarm/1.mp3"
    },
    "alarmVolume": 50,
    "alarmRepet": 0,
    "tickingType": {
        "name": "tricking 1",
        "src": "sounds/tricking/1.mp3"
    },
    "tickingVolume": 50,
    "templateClone": "",
    "createdAt": "2023-06-26T22:11:16.230Z",
    "updatedAt": "2023-06-26T22:11:16.614Z",
    "__v": 0
}
 */

const initialData = {
  name: "",
  desc: "",
  tasks: [],
};

function TemplateForm({
  oldData,
  isLoading,
  setIsLoading,
  setOpen
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState(oldData === null ? initialData : oldData);
  const [message, setMessage] = useState({ message: '', type: '' })

  const steps = [
    {
      text: 'info',
      Icon: () => <AiOutlineInfo />,
    },
    {
      text: 'todo',
      Icon: () => <TodoList />,
    },
    {
      text: 'timer',
      Icon: () => <CgTimelapse />,
    },
    {
      text: 'sound',
      Icon: () => <AiFillSound />,
    },
  ];

  const handleCancelOrPrev = () => {
    if (activeStep === 0) {
      setOpen(false);
    } else {
      setActiveStep(as => --as);
    }
  }

  const handleNextButton = (e) => {
    if (e.target.type === 'submit') {
      e.priventDefault();
    }
    console.log('next')
    if (activeStep < 3) {
      setActiveStep(as => ++as);
      debugger;
    }
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.priventDefault();
    console.log(e);
  }

  const disableNextOrSubmit = () => {
    switch (activeStep) {
      case 0:
        return !data.name || !data.desc;
      case 1:
        return data.tasks.length === 0;
      case 2:
        return true;
      default:
        return true;
    }
  }

  return (
    <>
      {(message.message && !message.message.includes('Network Error')) ? (
        <Message {...message} setMessage={setMessage} />
      ) : message.message.includes('Network Error') && (
        <NetworkError />
      )}

      <div className="glass-container">
        <div className="glass-effect temp-form">
          <div className='form-header'>
            <h2>{oldData ? 'edit template' : 'new template'}</h2>
            <button aria-label='close template form' className="close-temp-form" type='button' onClick={() => setOpen(false)}>
              <CgClose />
            </button>
          </div>
          <div className='steps'>
            {steps.map((step, index) => (
              <div key={index} className={`step ${index === activeStep ? 'active' : index < activeStep && 'completed'}`}>
                <div className='icon'>{<step.Icon />}</div>
                <p className='text'>{step.text}</p>
                {index !== 3 && (
                  <div className="line"></div>
                )}
              </div>
            ))}
          </div>
          {activeStep !== 1 ? (
            <form onSubmit={handleSubmit}>
              <div className='form-middle'>
                <Suspense fallback={<></>}>
                  {activeStep === 0 ? (
                    <InfoStep
                      key={0}
                      data={data}
                      setData={setData}
                      handleChange={handleChange}
                    />
                  ) :
                    activeStep === 2 ? (
                      <TimerStep
                        key={2}
                        data={data}
                        setData={setData}
                        handleChange={handleChange}
                      />
                    ) : (
                      <SoundStep
                        key={3}
                        data={data}
                        setData={setData}
                        handleChange={handleChange}
                      />
                    )
                  }
                </Suspense>
                <FormFooter
                  disableNextOrSubmit={disableNextOrSubmit}
                  handleCancelOrPrev={handleCancelOrPrev}
                  handleNextButton={handleNextButton}
                  activeStep={activeStep}
                />
              </div>
            </form>
          ) : (
            <div className='form-middle'>
              <Suspense fallback={<></>}>
                <TasksStep
                  key={1}
                  data={data}
                  setData={setData}
                  handleChange={handleChange}
                  message={message}
                  setMessage={setMessage}
                />
              </Suspense>
              <FormFooter
                disableNextOrSubmit={disableNextOrSubmit}
                handleCancelOrPrev={handleCancelOrPrev}
                handleNextButton={handleNextButton}
                activeStep={activeStep}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TemplateForm;
